#!/bin/bash
set -eu

TOPDIR=$(cd $(dirname $0); pwd)

# DB作成
mkdir -p ${TOPDIR}/database
rm -f ${TOPDIR}/database/*
DBNAME=${TOPDIR}/database/slack.db
groonga -n ${DBNAME} shutdown

# テーブル作成
TABLENAME=Messages
groonga ${DBNAME} table_create ${TABLENAME} TABLE_HASH_KEY Time

# カラム作成
groonga ${DBNAME} column_create --table ${TABLENAME} --name text --type Text
groonga ${DBNAME} column_create --table ${TABLENAME} --name user --type ShortText
groonga ${DBNAME} column_create --table ${TABLENAME} --name channel --type ShortText
groonga ${DBNAME} column_create --table ${TABLENAME} --name thread_ts --type Time
groonga ${DBNAME} column_create --table ${TABLENAME} --name ym --type UInt32

# text用の語彙表 & インデックスカラムの作成
groonga ${DBNAME} table_create \
    --name Lexicon \
    --flags TABLE_PAT_KEY \
    --key_type ShortText \
    --default_tokenizer TokenMecab \
    --normalizer NormalizerAuto

groonga ${DBNAME} column_create \
    --table Lexicon \
    --name messages_text \
    --flags COLUMN_INDEX\|WITH_POSITION \
    --type ${TABLENAME} \
    --source text

# channel用のインデックステーブル & インデックスカラムの作成
groonga ${DBNAME} table_create \
    --name Channels \
    --flag TABLE_DAT_KEY \
    --key_type ShortText

groonga ${DBNAME} column_create \
    --table Channels \
    --name messages_channel \
    --flags COLUMN_INDEX\|INDEX_SMALL \
    --type ${TABLENAME} \
    --source channel

# user用のインデックステーブル & インデックスカラムの作成
groonga ${DBNAME} table_create \
    --name Users \
    --flag TABLE_DAT_KEY \
    --key_type ShortText

groonga ${DBNAME} column_create \
    --table Users \
    --name messages_user \
    --flags COLUMN_INDEX\|INDEX_SMALL \
    --type ${TABLENAME} \
    --source user

# ym用のインデックステーブル & インデックスカラムの作成
groonga ${DBNAME} table_create \
    --name Yms \
    --flag TABLE_DAT_KEY \
    --key_type UInt32

groonga ${DBNAME} column_create \
    --table Yms \
    --name messages_ym \
    --flags COLUMN_INDEX\|INDEX_SMALL \
    --type ${TABLENAME} \
    --source ym

# 中間ファイル生成
mkdir -p ${TOPDIR}/intermediate
node ${TOPDIR}/json2json

# HTTPサーバー起動
groonga -p 10041 -d --protocol http ${DBNAME}

# DBに中間ファイルを読み込ませる
node ${TOPDIR}/load_json